var app = {

    DEFAULT_WORK_COUNTDOWN_TIME: 1500000,
    DEFAULT_SHORT_BREAK_COUNTDOWN_TIME: 300000,
    DEFAULT_LONG_BREAK_COUNTDOWN_TIME: 900000,
    DEFAULT_PLAY_ALARM_CONFIG: false,

    storage: null,

    isTimerRunning: false,

    isSettingsOpen: false,
    isAboutDialogOpen: false,

    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        document.addEventListener('backbutton', app.onBackButton, false);
        app.setUpLayout();
        app.setUp();
    },

    onBackButton: function () {
        if (app.isSettingsOpen) {
            var cdCloseMenu = document.querySelector('.cd-close-menu');
            cdCloseMenu.click();
            return false;
        }

        if (app.isAboutDialogOpen) {
            var cdPopUpClose = document.querySelector('.cd-popup-close');
            cdPopUpClose.click();
            return false;
        }

        if (app.isTimerRunning) {
            return false;
        }

        return true;
    },

    setUp: function () {

        var countdownTime;
        var countdownInterval;

        var work = document.getElementById('work');
        var shortBreak = document.getElementById('short-break');
        var longBreak = document.getElementById('long-break');
        var stop = document.getElementById('stop');

        var timer = document.getElementById('timer');
        var timer_status = document.getElementById('timer-status');
        var timer_information = document.getElementById('timer-information');

        var workButtonContainer = document.getElementById('work-button-container');
        var stopBreakButtonContainer = document.getElementById('stop-break-button-container');
        var stopContainer = document.getElementById('stop-button-container');

        var optionSave = document.getElementById('option-save');
        var optionReset = document.getElementById('option-reset');

        app.storage = new LocalDataStorage();

        timer.innerHTML = app.formatTime(app.getWorkTime(), 0);

        work.addEventListener('click', function (e) {

            if (countdownInterval != null || !(typeof countdownInterval == 'undefined')) {
                clearInterval(countdownInterval);
            }

            timer_information.style.display = 'none';
            timer_status.innerHTML = 'Work ongoing...';
            timer.style.display = 'block';

            var workTime = app.getWorkTime() * 1000 * 60;
            countdownTime = workTime;

            var minutesAndSeconds = app.getMinutesAndSecondsFromMilliseconds(countdownTime);
            timer.innerHTML = app.formatTime(minutesAndSeconds.minutes, minutesAndSeconds.seconds);

            workButtonContainer.style.display = 'none'
            stopBreakButtonContainer.style.display = 'block';
            stopContainer.style.display = 'block';

            app.isTimerRunning = true;
            countdownInterval = setInterval(
                function () {
                    if (countdownTime <= 0) {
                        clearInterval(countdownInterval);
                        timer.style.display = 'none';
                        timer_information.style.display = 'block';
                        timer_information.innerHTML = 'Time to take a break :-)';
                        timer_status.innerHTML = 'Work time finished.';

                        app.playAlarm();
                        app.isTimerRunning = false;

                        return;
                    }

                    countdownTime -= 1000;

                    var minutesAndSeconds = app.getMinutesAndSecondsFromMilliseconds(countdownTime);
                    timer.innerHTML = app.formatTime(minutesAndSeconds.minutes, minutesAndSeconds.seconds);

                }, 1000);
        });

        shortBreak.addEventListener('click', function (e) {

            if (countdownInterval != null || !(typeof countdownInterval == 'undefined')) {
                clearInterval(countdownInterval);
            }

            timer_information.style.display = 'none';
            timer_status.innerHTML = 'Get up take a coffee, you have short time :-)';
            timer.style.display = 'block';

            var shortBreakTime = app.getShortBreakTime() * 1000 * 60;
            countdownTime = shortBreakTime;

            var minutesAndSeconds = app.getMinutesAndSecondsFromMilliseconds(countdownTime);
            timer.innerHTML = app.formatTime(minutesAndSeconds.minutes, minutesAndSeconds.seconds);

            app.isTimerRunning = true;
            countdownInterval = setInterval(
                function () {
                    if (countdownTime <= 0) {
                        clearInterval(countdownInterval);
                        timer.style.display = 'none';
                        timer_information.innerHTML = 'Time to get back to work!';
                        timer_status.innerHTML = 'Break time ended :-(';
                        timer_information.style.display = 'block';

                        workButtonContainer.style.display = 'block'
                        stopContainer.style.display = 'block';
                        stopBreakButtonContainer.style.display = 'none';

                        app.playAlarm();
                        app.isTimerRunning = false;

                        return;
                    }

                    countdownTime -= 1000;
                    var minutesAndSeconds = app.getMinutesAndSecondsFromMilliseconds(countdownTime);

                    timer.innerHTML = app.formatTime(
                        minutesAndSeconds.minutes,
                        minutesAndSeconds.seconds);
                }, 1000);
        });

        longBreak.addEventListener('click', function (e) {

            if (countdownInterval != null || !(typeof countdownInterval == 'undefined')) {
                clearInterval(countdownInterval);
            }

            timer_information.style.display = 'none';
            timer_status.innerHTML = 'Man, without coffee there would be chaos, darkness';
            timer.style.display = 'block';

            var longBreakTime = app.getLongBreakTime() * 1000 * 60;
            countdownTime = longBreakTime;

            var minutesAndSeconds = app.getMinutesAndSecondsFromMilliseconds(countdownTime);
            timer.innerHTML = app.formatTime(minutesAndSeconds.minutes, minutesAndSeconds.seconds);

            app.isTimerRunning = true;
            countdownInterval = setInterval(
                function () {
                    if (countdownTime <= 0) {
                        clearInterval(countdownInterval);
                        timer.style.display = 'none';
                        timer_information.innerHTML = 'Time to get back to work!';
                        timer_status.innerHTML = 'Break time ended :-(';
                        timer_information.style.display = 'block';

                        workButtonContainer.style.display = 'block'
                        stopContainer.style.display = 'block';
                        stopBreakButtonContainer.style.display = 'none';

                        app.playAlarm();
                        app.isTimerRunning = false;

                        return;
                    }

                    countdownTime -= 1000;
                    var minutesAndSeconds = app.getMinutesAndSecondsFromMilliseconds(countdownTime);

                    timer.innerHTML = app.formatTime(
                        minutesAndSeconds.minutes,
                        minutesAndSeconds.seconds);
                }, 1000);
        });

        stop.addEventListener('click', function (e) {

            if (countdownInterval != null || !(typeof countdownInterval == 'undefined')) {
                clearInterval(countdownInterval);
            }

            var workTime = app.getWorkTime() * 1000 * 60;
            countdownTime = workTime;

            var minutesAndSeconds = app.getMinutesAndSecondsFromMilliseconds(countdownTime);
            timer.innerHTML = app.formatTime(minutesAndSeconds.minutes, minutesAndSeconds.seconds);

            timer_information.style.display = 'none';
            timer.style.display = 'block';
            timer_status.innerHTML = "Let's get our hands dirty? Touch 'WORK' to start :-)";

            stopBreakButtonContainer.style.display = 'none';
            stopContainer.style.display = 'none';
            workButtonContainer.style.display = 'block'

            app.isTimerRunning = false;
        });

        optionSave.addEventListener('click', function (e) {
            app.setWorkTime();
            app.setShortBreakTime();
            app.setLongBreakTime();
            app.setPlayAlarmConfiguration();

            document.querySelector('.cd-close-menu').click();
        });

        optionReset.addEventListener('click', function (e) {
            app.setWorkTime(app.DEFAULT_WORK_COUNTDOWN_TIME);
            app.setShortBreakTime(app.DEFAULT_SHORT_BREAK_COUNTDOWN_TIME);
            app.setLongBreakTime(app.DEFAULT_LONG_BREAK_COUNTDOWN_TIME);
            app.setPlayAlarmConfiguration(app.DEFAULT_PLAY_ALARM_CONFIG);

            var optionWorkTime = document.getElementById('option-work-time');
            optionWorkTime.value = app.getWorkTime();

            var optionShortTime = document.getElementById('option-short-break-time');
            optionShortTime.value = app.getShortBreakTime();

            var optionLongTime = document.getElementById('option-long-break-time');
            optionLongTime.value = app.getLongBreakTime();

            var playAlarmInput = document.getElementById('option-play-sound');
            playAlarmInput.checked = app.getPlayAlarmConfiguration();
        });
    },

    setUpLayout: function () {
        var cdMenuTrigger = document.querySelector('.cd-menu-trigger');
        var cdCloseMenu = document.querySelector('.cd-close-menu');
        var cdHeader = document.querySelector('.cd-header');
        var cdBlurredBg = document.querySelector('.cd-blurred-bg');

        var cdMainContent = document.getElementById('cd-main-content');
        var mainNav = document.getElementById('main-nav');
        var cdShadowLayer = document.querySelector('.cd-shadow-layer');

        cdMenuTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            app.isSettingsOpen = true;

            cdMainContent.classList.add('move-out');
            mainNav.classList.add('is-visible');
            cdShadowLayer.classList.add('is-visible');

            var optionWorkTime = document.getElementById('option-work-time');
            optionWorkTime.value = app.getWorkTime();

            var optionShortTime = document.getElementById('option-short-break-time');
            optionShortTime.value = app.getShortBreakTime();

            var optionLongTime = document.getElementById('option-long-break-time');
            optionLongTime.value = app.getLongBreakTime();

            var optionAlarm = document.getElementById('option-play-sound');
            optionAlarm.checked = app.getPlayAlarmConfiguration();

            var optionContainer = document.querySelector('.configuration-container');
            optionContainer.style.display = 'block';
        });

        cdCloseMenu.addEventListener('click', function (event) {
            event.preventDefault();
            app.isSettingsOpen = false;

            var optionContainer = document.querySelector('.configuration-container');
            optionContainer.style.display = 'none';

            cdMainContent.classList.remove('move-out');
            mainNav.classList.remove('is-visible');
            cdShadowLayer.classList.remove('is-visible');
        });

        set_clip_property();

        window.addEventListener('resize', function () {
            set_clip_property();
        });

        function set_clip_property() {
            var $header_height = cdHeader.offsetHeight,
                $window_height = window.innerHeight,
                $header_top = $window_height - $header_height,
                $window_width = window.innerWidth;

            cdBlurredBg.style.clip = 'rect(' + $header_top + 'px, ' + $window_width + 'px, ' + $window_height + 'px, 0px)';
        }

        var popUpTrigger = document.querySelector('.cd-options-trigger');
        var popUp = document.querySelector('.cd-popup');
        var btnClosePopUp = document.getElementById('btn-close-popup');
        var topBtnClosePopUp = document.querySelector('.cd-popup-close');

        popUpTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            app.isAboutDialogOpen = true;
            popUp.classList.add('is-visible');
        });

        btnClosePopUp.addEventListener('click', function (event) {
            event.preventDefault();
            app.isAboutDialogOpen = false;
            popUp.classList.remove('is-visible');
        });

        topBtnClosePopUp.addEventListener('click', function (event) {
            event.preventDefault();
            popUp.classList.remove('is-visible');
        });

        document.addEventListener('keyup', function (event) {
            if (event.which == '27') {
                popUp.classList.remove('is-visible');
            }
        });

    },

    formatTimeBelowTen: function (value) {
        if (value < 10) {
            value = "0" + value;
        }

        return value;
    },

    getMinutesAndSecondsFromMilliseconds: function (milliseconds) {
        var minutes = Math.floor((milliseconds / 1000) / 60);
        var seconds = Math.round((milliseconds / 1000) % 60);

        return {
            minutes: minutes,
            seconds: seconds
        };
    },

    formatTime: function (minutes, seconds) {
        return (app.formatTimeBelowTen(minutes) + ":" + app.formatTimeBelowTen(seconds));
    },

    playAlarm: function () {
        if (app.getPlayAlarmConfiguration()) {
            var media = new Media('/android_asset/www/sound/alarm.mp3');
            media.play();
        }
    },

    getWorkTime: function () {
        var workTime = app.storage.getItem('workTime');

        if (workTime) {
            var time = app.getMinutesAndSecondsFromMilliseconds(workTime);
            return time.minutes;
        }

        var time = app.getMinutesAndSecondsFromMilliseconds(app.DEFAULT_WORK_COUNTDOWN_TIME);

        return time.minutes;
    },

    setWorkTime: function (value) {
        if (value) {
            app.storage.removeItem('workTime');
            app.storage.setItem('workTime', value);
            return;
        }

        var optionWorkTime = document.getElementById('option-work-time');
        var configuredWorkTime = optionWorkTime.value;

        var workTime = configuredWorkTime * 1000 * 60;
        app.storage.removeItem('workTime');
        app.storage.setItem('workTime', workTime);

        if (!app.isTimerRunning) {
            var timer = document.getElementById('timer');
            timer.innerHTML = app.formatTime(configuredWorkTime, 0);
        }
    },

    getShortBreakTime: function () {
        var shortBreakTime = app.storage.getItem('shortBreakTime');

        if (shortBreakTime) {
            var time = app.getMinutesAndSecondsFromMilliseconds(shortBreakTime);
            return time.minutes;
        }

        var time = app.getMinutesAndSecondsFromMilliseconds(app.DEFAULT_SHORT_BREAK_COUNTDOWN_TIME);

        return time.minutes;
    },

    setShortBreakTime: function (value) {
        if (value) {
            app.storage.removeItem('shortBreakTime');
            app.storage.setItem('shortBreakTime', value);
            return;
        }

        var optionShortBreakTime = document.getElementById('option-short-break-time');
        var configuredShortBreakTime = optionShortBreakTime.value;

        var shortTime = configuredShortBreakTime * 1000 * 60;
        app.storage.removeItem('shortBreakTime');
        app.storage.setItem('shortBreakTime', shortTime);
    },

    getLongBreakTime: function () {
        var longBreakTime = app.storage.getItem('longBreakTime');

        if (longBreakTime) {
            var time = app.getMinutesAndSecondsFromMilliseconds(longBreakTime);
            return time.minutes;
        }

        var time = app.getMinutesAndSecondsFromMilliseconds(app.DEFAULT_LONG_BREAK_COUNTDOWN_TIME);

        return time.minutes;
    },

    setLongBreakTime: function (value) {
        if (value) {
            app.storage.removeItem('longBreakTime');
            app.storage.setItem('longBreakTime', value);
            return;
        }

        var optionLongBreakTime = document.getElementById('option-long-break-time');
        var configuredLongBreakTime = optionLongBreakTime.value;

        var longTime = configuredLongBreakTime * 1000 * 60;
        app.storage.removeItem('longBreakTime');
        app.storage.setItem('longBreakTime', longTime);
    },

    getPlayAlarmConfiguration: function () {
        var config = app.storage.getItem('playAlarm');

        if (config) {
            return config == 'true';
        }

        return false;
    },

    setPlayAlarmConfiguration: function (value) {
        if (value != null && typeof value != 'undefined') {
            app.storage.removeItem('playAlarm');
            app.storage.setItem('playAlarm', value);
            return;
        }

        var optionPlayAlarm = document.getElementById('option-play-sound');
        var config = optionPlayAlarm.checked == 'checked' || optionPlayAlarm.checked == true;

        app.storage.removeItem('playAlarm');
        app.storage.setItem('playAlarm', config);
    }

};
