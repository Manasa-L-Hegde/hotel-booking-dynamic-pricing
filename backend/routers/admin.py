import math
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from backend.config import settings
from backend.database import get_db
from backend.models import LoginActivity
from backend.services.auth_service import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

def active_since():
    return datetime.now(timezone.utc) - timedelta(minutes=settings.ACTIVE_SESSION_TIMEOUT_MINUTES)

@router.get("/login-activity")
def get_login_activity(
    search: Optional[str] = "",
    method: Optional[str] = "",
    status: Optional[str] = "",
    date: Optional[str] = "",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    query = db.query(LoginActivity)

    if method and method in ("EMAIL", "MOBILE_OTP"):
        query = query.filter(LoginActivity.login_method == method)

    if status in ("SUCCESS", "FAILED"):
        query = query.filter(LoginActivity.status == status)
    elif status == "ACTIVE":
        query = query.filter(
            LoginActivity.status == "SUCCESS",
            LoginActivity.logout_time == None,
            LoginActivity.login_time >= active_since()
        )

    if date:
        try:
            start_date = datetime.strptime(date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            end_date = start_date + timedelta(days=1)
            query = query.filter(LoginActivity.login_time >= start_date, LoginActivity.login_time < end_date)
        except Exception:
            pass

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                LoginActivity.name.ilike(term),
                LoginActivity.email.ilike(term),
                LoginActivity.phone.ilike(term)
            )
        )

    total = query.count()
    rows = query.order_by(LoginActivity.login_time.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "success": True,
        "data": [
            {
                "name": r.name,
                "email": r.email,
                "phone": r.phone,
                "loginMethod": r.login_method,
                "loginTime": r.login_time.isoformat() if r.login_time else None,
                "logoutTime": r.logout_time.isoformat() if r.logout_time else None,
                "status": r.status
            }
            for r in rows
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": math.ceil(total / limit) if total > 0 else 1
        }
    }

@router.get("/active-users")
def get_active_users(
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    threshold = active_since()
    count = db.query(LoginActivity.user_id).filter(
        LoginActivity.status == "SUCCESS",
        LoginActivity.logout_time == None,
        LoginActivity.login_time >= threshold,
        LoginActivity.user_id != None
    ).distinct().count()

    return {
        "success": True,
        "activeUsers": count,
        "activeSessionTimeoutMinutes": settings.ACTIVE_SESSION_TIMEOUT_MINUTES
    }

@router.get("/login-statistics")
def get_login_statistics(
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    rows = db.query(
        LoginActivity.login_method,
        LoginActivity.status,
        func.count(LoginActivity.id)
    ).filter(
        LoginActivity.login_time >= today_start
    ).group_by(
        LoginActivity.login_method,
        LoginActivity.status
    ).all()

    summary = {
        "totalLoginsToday": 0,
        "emailLoginsToday": 0,
        "mobileOtpLoginsToday": 0,
        "failedAttemptsToday": 0
    }

    for method, status_val, count in rows:
        if status_val == "SUCCESS":
            summary["totalLoginsToday"] += count
            if method == "EMAIL":
                summary["emailLoginsToday"] += count
            elif method == "MOBILE_OTP":
                summary["mobileOtpLoginsToday"] += count
        else:
            summary["failedAttemptsToday"] += count

    return {
        "success": True,
        **summary
    }

@router.get("/login-statistics/daily")
def get_daily_login_statistics(
    days: int = Query(7, ge=1, le=90),
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    start = datetime.now(timezone.utc) - timedelta(days=days - 1)
    start = start.replace(hour=0, minute=0, second=0, microsecond=0)

    rows = db.query(
        func.date(LoginActivity.login_time).label("date_str"),
        LoginActivity.login_method,
        func.count(LoginActivity.id)
    ).filter(
        LoginActivity.login_time >= start,
        LoginActivity.status == "SUCCESS"
    ).group_by(
        func.date(LoginActivity.login_time),
        LoginActivity.login_method
    ).order_by(
        func.date(LoginActivity.login_time)
    ).all()

    data = [
        {
            "_id": {
                "date": str(r[0]),
                "method": r[1]
            },
            "count": r[2]
        }
        for r in rows
    ]

    return {
        "success": True,
        "data": data
    }
