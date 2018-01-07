import moment from "moment/moment";



export const priceFormatter = (price) => {
    return price.toFixed(8);
};


export const percentageFormatter = (percentage) => {
    return `${percentage.toFixed(2)} %`;
};


export const timeFormatter = (datetime) => {
    return moment(datetime).format("HH:mm:ss [GMT]ZZ[ (CET) ]");
};