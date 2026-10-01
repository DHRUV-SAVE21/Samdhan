from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="BloodGrid Operational API",
    description="Real-time Blood Fulfilment, Donor Network & Cold-Chain Telemetry API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REQUESTS_DB = [
    {
        "id": "REQ-2026-089",
        "hospital": "Cooper Municipal General Hospital",
        "location": "Vile Parle West, Mumbai",
        "bloodGroup": "O-",
        "component": "Packed Red Blood Cells (PRBC)",
        "units": 2,
        "urgency": "Critical",
        "verified": True,
        "officer": "Dr. A. Deshmukh (Reg #MMC-48291)",
        "status": "In Transit (Smart Box #SB-04)",
        "source": "KEM Regional Blood Bank",
        "eta": "11 mins",
        "temp": "2.4°C",
        "qrCode": "BG-2026-A841",
        "progress": 78,
    },
    {
        "id": "REQ-2026-092",
        "hospital": "Nanavati Super Speciality Hospital",
        "location": "Vile Parle West, Mumbai",
        "bloodGroup": "A+",
        "component": "Single Donor Platelets (SDP)",
        "units": 1,
        "urgency": "Urgent",
        "verified": True,
        "officer": "Blood Bank Officer #BBO-119",
        "status": "Geo-Ring 1 Mobilization",
        "source": "6 Verified Donors Alerted (0-3 km)",
        "eta": "18 mins",
        "temp": "3.1°C",
        "qrCode": "BG-2026-A849",
        "progress": 48,
    },
    {
        "id": "REQ-2026-095",
        "hospital": "Sion LTMG Hospital Blood Centre",
        "location": "Sion, Mumbai",
        "bloodGroup": "B-",
        "component": "Whole Blood",
        "units": 3,
        "urgency": "High",
        "verified": True,
        "officer": "Duty CMO #SION-302",
        "status": "Handover Verified · Closed",
        "source": "Nair Hospital Blood Bank",
        "eta": "Delivered",
        "temp": "2.8°C",
        "qrCode": "BG-2026-A832",
        "progress": 100,
    },
]

DONORS_DB = [
    {
        "id": "DNR-901",
        "name": "Aarav Kulkarni",
        "bloodGroup": "O-",
        "zone": "Vile Parle West (1.2 km)",
        "ring": "Ring 1 (0–3 km)",
        "status": "Available",
        "lastDonated": "114 days ago",
        "eligible": True,
        "donations": 7,
        "maskedContact": "+91 98••• ••412",
    },
    {
        "id": "DNR-904",
        "name": "Riya Sharma",
        "bloodGroup": "A+",
        "zone": "Andheri East (2.4 km)",
        "ring": "Ring 1 (0–3 km)",
        "status": "Available",
        "lastDonated": "96 days ago",
        "eligible": True,
        "donations": 4,
        "maskedContact": "+91 97••• ••809",
    },
    {
        "id": "DNR-908",
        "name": "Kabir Joshi",
        "bloodGroup": "B-",
        "zone": "Santacruz West (3.4 km)",
        "ring": "Ring 2 (3–7 km)",
        "status": "Responding",
        "lastDonated": "140 days ago",
        "eligible": True,
        "donations": 11,
        "maskedContact": "+91 91••• ••231",
    },
    {
        "id": "DNR-912",
        "name": "Sneha Deshpande",
        "bloodGroup": "AB+",
        "zone": "Bandra West (4.8 km)",
        "ring": "Ring 2 (3–7 km)",
        "status": "Available",
        "lastDonated": "195 days ago",
        "eligible": True,
        "donations": 5,
        "maskedContact": "+91 99••• ••654",
    },
]

INVENTORY_DB = [
    {"group": "A+", "units": 42, "status": "Optimal", "forecast": "Stable for 72h", "bank": "Vile Parle Regional Blood Centre", "component": "PRBC / Whole Blood"},
    {"group": "A-", "units": 7, "status": "Watch", "forecast": "Predicted dip in 18h", "bank": "Andheri Red Cross Society", "component": "PRBC"},
    {"group": "B+", "units": 56, "status": "Optimal", "forecast": "Surplus (+14%)", "bank": "Cooper Hospital Blood Bank", "component": "PRBC / Plasma"},
    {"group": "B-", "units": 4, "status": "Critical", "forecast": "Ring 1 Donor Alert Active", "bank": "Sion Regional Network", "component": "Whole Blood"},
    {"group": "O+", "units": 38, "status": "Optimal", "forecast": "Normal daily turnover", "bank": "Nanavati Blood Centre", "component": "PRBC / Platelets"},
    {"group": "O-", "units": 3, "status": "Critical", "forecast": "Universal Donor Reserve Active", "bank": "KEM Emergency Hub", "component": "PRBC"},
    {"group": "AB+", "units": 29, "status": "Optimal", "forecast": "Stable for 96h", "bank": "Bandra Community Blood Bank", "component": "Plasma / PRBC"},
    {"group": "AB-", "units": 5, "status": "Watch", "forecast": "Pre-alert 10 Verified Donors", "bank": "Dadar Metro Blood Bank", "component": "PRBC"},
]


class BloodRequestCreate(BaseModel):
    hospital: str
    location: str
    bloodGroup: str
    component: str
    units: int
    urgency: str
    officer: str


class DonorCreate(BaseModel):
    name: str
    bloodGroup: str
    zone: str
    phone: Optional[str] = None


class AuthPayload(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    role: Optional[str] = "Donor"
    bloodGroup: Optional[str] = "O+"


@app.get("/")
def root():
    return {"name": "BloodGrid API", "status": "online", "version": "1.0.0"}


@app.get("/api/health")
def health():
    return {"status": "healthy", "coldChainActive": True}


@app.get("/api/feature/dashboard-stats")
def get_dashboard_stats():
    return {
        "totalUnits": sum(i["units"] for i in INVENTORY_DB),
        "activeDonors": 1428,
        "verifiedRequests": len(REQUESTS_DB),
        "smartBoxesActive": 14,
        "avgMatchTime": "6.4 mins",
        "coldChainCompliance": "99.8%",
    }


@app.get("/api/feature/requests")
def get_requests():
    return REQUESTS_DB


@app.post("/api/feature/requests")
def create_request(payload: BloodRequestCreate):
    new_id = f"REQ-2026-{100 + len(REQUESTS_DB) + 1}"
    qr_code = f"BG-2026-U{850 + len(REQUESTS_DB)}"
    item = {
        "id": new_id,
        "hospital": payload.hospital,
        "location": payload.location,
        "bloodGroup": payload.bloodGroup,
        "component": payload.component,
        "units": payload.units,
        "urgency": payload.urgency,
        "verified": True,
        "officer": payload.officer,
        "status": "Verified · Smart Box Assigned",
        "source": "Regional Blood Bank + Ring 1 Alerted",
        "eta": "09 mins",
        "temp": "2.4°C",
        "qrCode": qr_code,
        "progress": 40,
    }
    REQUESTS_DB.insert(0, item)
    return item


@app.get("/api/feature/donors")
def get_donors():
    return DONORS_DB


@app.post("/api/feature/donors")
def register_donor(payload: DonorCreate):
    item = {
        "id": f"DNR-{920 + len(DONORS_DB)}",
        "name": payload.name,
        "bloodGroup": payload.bloodGroup,
        "zone": payload.zone,
        "ring": "Ring 1 (0–3 km)",
        "status": "Available",
        "lastDonated": "Eligible Now",
        "eligible": True,
        "donations": 1,
        "maskedContact": "+91 98••• ••Protected",
    }
    DONORS_DB.insert(0, item)
    return item


@app.get("/api/feature/inventory")
def get_inventory():
    return INVENTORY_DB


@app.post("/api/feature/custody/verify/{req_id}")
def verify_custody(req_id: str):
    for req in REQUESTS_DB:
        if req["id"] == req_id or req["qrCode"] == req_id:
            req["status"] = "Handover Verified · Closed"
            req["eta"] = "Delivered"
            req["progress"] = 100
            return req
    return {"status": "verified", "id": req_id}


@app.post("/api/auth/login")
def login(payload: AuthPayload):
    return {
        "id": "USR-2026-01",
        "full_name": payload.name or payload.email.split("@")[0].title(),
        "email": payload.email,
        "role": payload.role or "Donor",
        "bloodGroup": payload.bloodGroup or "O+",
        "token": "bg-jwt-verified-token",
    }


@app.post("/api/auth/register")
def register(payload: AuthPayload):
    return {
        "id": "USR-2026-02",
        "full_name": payload.name or "Verified Member",
        "email": payload.email,
        "role": payload.role or "Donor",
        "bloodGroup": payload.bloodGroup or "O+",
        "token": "bg-jwt-verified-token",
    }
