function initializePomodoroPage() {
    PomodoroModule.initPomodoro();
    PomodoroSettingsModule.initPomodoroSettings();
}

$(document).ready(initializePomodoroPage);
