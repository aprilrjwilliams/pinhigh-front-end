// export interface UserModel{
//     username: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     phone: string;
// }

export interface AuthModel{
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    isAdmin?: string
}