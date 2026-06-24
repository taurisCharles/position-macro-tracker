from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()


def daily_snapshot_job() -> None:
    # Wire quote refresh, macro refresh, and exit-rule evaluation here.
    return None


def start_scheduler() -> None:
    if scheduler.running:
        return
    scheduler.add_job(daily_snapshot_job, "cron", hour=17, minute=0, id="daily_snapshot", replace_existing=True)
    scheduler.start()


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)

