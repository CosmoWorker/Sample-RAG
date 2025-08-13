type config=Record<"SECRET_KEY"| "PORT" | "REFRESH_TOKEN_EXPIRY" | "ACCESS_TOKEN_EXPIRY", string>
if (!Bun.env.SECRET_KEY || !Bun.env.PORT || !Bun.env.REFRESH_TOKEN_EXPIRY ||!Bun.env.ACCESS_TOKEN_EXPIRY){
    throw new Error("Environment variables might by empty")
}

export const envConfig: config ={           
    SECRET_KEY: Bun.env.SECRET_KEY,
    PORT: Bun.env.PORT,
    REFRESH_TOKEN_EXPIRY: Bun.env.REFRESH_TOKEN_EXPIRY,
    ACCESS_TOKEN_EXPIRY: Bun.env.ACCESS_TOKEN_EXPIRY
}