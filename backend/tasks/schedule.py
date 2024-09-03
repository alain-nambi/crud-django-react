# tasks/scheduler.py

import time
import schedule
from threading import Thread

class Scheduler(Thread):
    def __init__(self):
        super().__init__()

    def run(self):
        while True:
            schedule.run_pending()
            time.sleep(1)
