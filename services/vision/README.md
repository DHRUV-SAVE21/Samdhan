# Vision service

This service will ingest CCTV/IP/RTSP streams, apply camera calibration and zone masks, run YOLO or RT-DETR detection and tracking, estimate density under occlusion, calculate optical flow, and publish fused risk events to the API.

Keep model weights outside Git. Add adapters under `src/`, configuration under `config/`, and tests under `tests/` when implementation begins.
