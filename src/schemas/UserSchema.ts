import { User } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
    id: Type.Number(),
    full_name: Type.String(),
    national_id: Type.String(),
    birth_date: Type.String(),
    created_at: Type.String({ format: 'date-time' }),
});

export type TUserSchema = Static<typeof UserSchema>;

export const UserArraySchema = Type.Array(UserSchema);

export type TUserArraySchema = Static<typeof UserArraySchema>;

export type UserLike = Pick<User, 'id' | 'full_name' | 'national_id' | 'birth_date' | 'created_at'>;
export function convertToUserSchema(user: UserLike): TUserSchema {
    return {
        id: user.id,
        full_name: user.full_name,
        national_id: user.national_id,
        birth_date: user.birth_date.toISOString(),
        created_at: user.created_at.toISOString(),
    };
}
