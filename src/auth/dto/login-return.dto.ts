import { User } from 'src/users/user.entity';

export class loginReturnDto {
  user: User;
  token: string;
}
