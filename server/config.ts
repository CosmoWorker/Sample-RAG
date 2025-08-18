type config=Record<"SECRET_KEY"| "PORT" | "REFRESH_TOKEN_EXPIRY" | "ACCESS_TOKEN_EXPIRY" | "CLOUDINARY_API_SECRET" | "CLOUDINARY_API_KEY" | "CLOUD_NAME", string>
if (!Bun.env.SECRET_KEY || !Bun.env.PORT || !Bun.env.REFRESH_TOKEN_EXPIRY ||!Bun.env.ACCESS_TOKEN_EXPIRY || !Bun.env.CLOUDINARY_API_SECRET || !Bun.env.CLOUDINARY_API_KEY || !Bun.env.CLOUD_NAME){
    throw new Error("Environment variables might by empty")
}

export const envConfig: config ={           
    SECRET_KEY: Bun.env.SECRET_KEY,
    PORT: Bun.env.PORT,
    REFRESH_TOKEN_EXPIRY: Bun.env.REFRESH_TOKEN_EXPIRY,
    ACCESS_TOKEN_EXPIRY: Bun.env.ACCESS_TOKEN_EXPIRY,
    CLOUDINARY_API_KEY: Bun.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: Bun.env.CLOUDINARY_API_SECRET,
    CLOUD_NAME: Bun.env.CLOUD_NAME,
}