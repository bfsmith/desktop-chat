import { User } from '../../shared/user';
import { Injectable } from '@angular/core';

@Injectable()
export class AppContextService {
	public user: User;
}