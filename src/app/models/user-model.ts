export interface UserModel{
    id: string;
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    isAdmin?: string
}