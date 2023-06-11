//export const API = 'http://localhost:8080';
export const API = 'https://viju-server-production.up.railway.app';

export function formatDate(date) {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const formattedDate = `${day} ${month}, ${year}`;

    return formattedDate;
}

export function convertDate(date) {
    const currentDate = new Date();
    const convertedDate = new Date(date);

    const elapsedTime = currentDate - convertedDate;
    const secondsElapsed = elapsedTime / 1000;

    const minutesElapsed = secondsElapsed / 60;
    const hoursElapsed = minutesElapsed / 60;
    const daysElapsed = hoursElapsed / 24;

    if (daysElapsed > 365) {
        return `hace ${Math.floor(daysElapsed / 365)} año`;
    } else if (daysElapsed == 1) {
        return `hace ${Math.floor(daysElapsed)} dia`;
    } else if (daysElapsed > 1) {
        return `hace ${Math.floor(daysElapsed)} dias`;
    } else if (hoursElapsed == 1) {
        return `hace ${Math.floor(hoursElapsed)} hora`;
    } else if (hoursElapsed > 1) {
        return `hace ${Math.floor(hoursElapsed)} horas`;
    } else {
        return `hace ${Math.floor(minutesElapsed)} minutos`;
    }
}