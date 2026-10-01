import os
from functools import lru_cache
from supabase import Client, create_client

@lru_cache
def get_supabase() -> Client:
    url, key = os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be configured")
    return create_client(url, key)
