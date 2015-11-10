'use strict';

function pluralize_(number, result, words) {
    if (number == 0) {
        return result;
    }
    if ((number >= 5 && number < 21)) {
        result += number + ' ' + words[2] + ' ';
    } else if ((number % 10) == 1) {
        result += number + ' ' + words[0] + ' ';
    } else if ((number % 10) === 0) {
        result += number + ' ' + words[2] + ' ';
    } else if ((number % 10) < 5) {
        result += number + ' ' + words[1] + ' ';
    } else if ((number % 10) >= 5) {
        result += number + ' ' + words[2] + ' ';
    }
    return result;
}

function pluralizeRemaining(days, hours, minutes) {
    if (days > 0) {
        if (days != 11 && days % 10 == 1) {
            return 'остался ';
        } else {
            return 'осталось ';
        }
    } else if (hours > 0) {
        if (hours != 11 && hours % 10 == 1) {
            return 'остался ';
        } else {
            return 'осталось ';
        }
    } else if (minutes > 0) {
        if (minutes != 11 && minutes % 10 == 1) {
            return 'остался ';
        } else {
            return 'осталось ';
        }
    }
}
function pluralize(days, hours, minutes) {
    var result = 'До ограбления ';
    result += pluralizeRemaining(days, hours, minutes);
    result = pluralize_(days, result, ['день', 'дня', 'дней']);
    result = pluralize_(hours, result, ['час', 'часа', 'часов']);
    result = pluralize_(minutes, result, ['минута', 'минуты', 'минут']);
    return result;
}

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        date: null,

        // А здесь часовой пояс
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
            if (!this.date) {
                throw 'Не найден подходящий момент для ограбления!';
            }
            var localDate = new Date(this.date - (-this.timezone * 1000 * 3600));
            var days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            var hours = (localDate.getHours() < 10 ?
                '0' + localDate.getHours() :
                localDate.getHours()
            );
            var mins = (localDate.getMinutes() < 10 ?
                '0' + localDate.getMinutes() :
                localDate.getMinutes()
            );
            var result = pattern.replace('%DD', days[localDate.getDay()]);
            result = result.replace('%HH', hours);
            return result.replace('%MM', mins);
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            if (!this.date) {
                throw 'Не найден подходящий момент для ограбления!';
            }
            var tempDate = new Date(this.date - moment.date);
            var days = Math.floor(tempDate.getTime() / (1000 * 60 * 60 * 24));
            var hours = Math.floor(tempDate.getTime() / (1000 * 60 * 60)) % 24;
            var minutes = Math.floor(tempDate.getTime() / (1000 * 60)) % 60;
            return pluralize(days, hours, minutes).slice(0, -1);
        }
    };
};
