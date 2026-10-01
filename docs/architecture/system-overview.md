# Drishti AI system overview

Drishti AI is a proactive crowd-intelligence platform, not a simple threshold counter.

```text
CCTV / IP / RTSP -> Calibration + zones -> Hybrid perception
                                            |-- detection and tracking
                                            |-- density estimation
                                            `-- optical flow
                                                      |
                                                      v
                                             Risk/event engine
                                                      |
                                      FastAPI <-> Operations UI
                                          `-- Supabase --'
```

## Boundaries

- `apps/web`: operator-facing React dashboard.
- `apps/api`: versioned FastAPI application and domain logic.
- `services/vision`: independent compute-heavy perception pipeline.
- `packages/shared`: stable cross-service contracts.
- `infrastructure`: deployment and observability assets.
- `docs/reference`: supplied event and pitch resources.

## UX principles

- Show risk and required action before secondary analytics.
- Every incident identifies its camera and calibrated zone.
- Use labels and icons with color so safety never depends on color alone.
- Keep high-density views legible at command-centre distance.
- Treat model output as confidence-based evidence, not unquestionable truth.
