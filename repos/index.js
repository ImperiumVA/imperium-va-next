import _MenuRepo from './MenuRepo';
import _AccountRepo from './AccountRepo';
import _OnAirCompanyRepo from './OnAirCompanyRepo';
import _MenuItemRepo from './MenuItemRepo';

export const MenuRepo = _MenuRepo;
export const MenuItemRepo = _MenuItemRepo;
export const AccountRepo = _AccountRepo;
export const OnAirCompanyRepo = _OnAirCompanyRepo;

export default {
    MenuRepo,
    MenuItemRepo,
    AccountRepo,
    OnAirCompanyRepo,
}