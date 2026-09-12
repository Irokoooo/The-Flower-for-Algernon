# Worker status

Each worker owns one JSON file: core, cognition, narrative, scene-kit, audio-assets.
Fields: status (in_progress/blocked/review/complete), progress (0-100 for assigned task only), note, updatedAt (UTC ISO timestamp), optional blockers and changedFiles.
Update at meaningful milestones. Complete means task delivery, not entire game completion. Lead reviews integration and maintains PRD evidence in project-status.json. Do not overwrite another worker's file. Dashboard polls these files and ASSET_MANIFEST.json every 15 seconds; it does not pretend to measure live agent telemetry.
