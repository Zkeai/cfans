export interface IBalance {
    operation: string,
    userId: string,
    balance: number
}

export interface IAuthUser {
    email: string,
    name: string,
    image: string,
    authProviderId: string
}