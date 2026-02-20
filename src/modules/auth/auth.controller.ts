import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("sign-up")
  signUp(@Body() dto: SignUpDto) {
    return this.auth.signUp(dto.email, dto.password);
  }

  @Post("sign-in")
  signIn(@Body() dto: SignInDto) {
    return this.auth.signIn(dto.email, dto.password);
  }
}