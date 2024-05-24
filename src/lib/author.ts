export class Author {
    name: string;
    email: string;
    details: { [key: string]: any };

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
        this.details = {};
    }
}

