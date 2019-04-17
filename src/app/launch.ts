export interface Launch {
    flight_number: number;
    launch_year: string;
    rocket: Rocket;
    details: string;
    links: Links;
}

export interface Rocket {
    rocket_name: string;
}

export interface Links {
    presskit: string;
}