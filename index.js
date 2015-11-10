'use strict';

var moment = require('./moment');
var robbery = require('./robbery');

// Трое аферистов решили пойти на «дело» ;)
var gang = require('fs').readFileSync('gang.json', 'utf-8');

// Небходимо найти ближайшее свободное время, чтобы ограбить банк в Котеринбурге (часовой пояс +5)
//  - На ограбление понадобится не менее 90 минут,
//  - Все члены банды должны быть свободны в это время
//  - Ограбление должно состоятся в рабочие часы, чтобы двери банка были открыты

var robberyMoment = robbery.getAppropriateMoment(
    // Расписание членов банды
    gang,

    // 90 минут
    480,

    // Рабочие часы банка
    {
        from: '09:00+5',
        to: '21:00+5'
    }
);

// Вышлем приглашение:
// - %DD - день недели (ПН, ВТ, СР, ЧТ, ПТ, СБ, ВС)
// - %HH - часы
// - %MM - минуты
console.log(
    robberyMoment.format('Ограбление должно состоятся в %DD. Всем быть готовыми к %HH:%MM!')
);
// Ограбление должно состоятся в ВТ. Всем быть готовыми к 03:30!

// Для Дарьи вышлем приглашение в её часовом поясе, так как она живёт на Тортуге (часовой пояс -5):
robberyMoment.timezone = -5; // Переводим время в часовой пояс Дарьи
console.log(
    robberyMoment.format('Дарья, прилетай в Котеринбург в %DD. Собираемся в %HH:%MM!')
);
robberyMoment.timezone = 5; // Переводим время в часовой пояс Котеринбурга


// Необязательное задание (+40 к смекалке)

var currentMoment = moment();

// Как во всех фильмах про ограбления мы будем писать:

currentMoment.date = 'ПН 09:01+5';
console.log(
    robbery.getStatus(currentMoment, robberyMoment)
);
// «До ограбления остался 1 день 6 часов 59 минут»

//currentMoment.date = 'ПН 12:59+5';
currentMoment.date = 'ПН 00:01+5';
console.log(
    robbery.getStatus(currentMoment, robberyMoment)
);
// «До ограбления остался 21 час 1 минута»
