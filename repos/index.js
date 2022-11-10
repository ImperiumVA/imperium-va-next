import _MenuRepo from './MenuRepo';
import _AccountRepo from './AccountRepo';
import _CompanyRepo from './CompanyRepo';
import _MenuItemRepo from './MenuItemRepo';
import _AppConfigRepo from './AppConfigRepo';
import _VirtualAirlineRepo from './VirtualAirlineRepo';

export const MenuRepo = _MenuRepo;
export const MenuItemRepo = _MenuItemRepo;
export const AccountRepo = _AccountRepo;
export const CompanyRepo = _CompanyRepo;
export const AppConfigRepo = _AppConfigRepo;
export const VirtualAirlineRepo = _VirtualAirlineRepo;

export default {
    MenuRepo,
    MenuItemRepo,
    AccountRepo,
    CompanyRepo,
    AppConfigRepo,
    VirtualAirlineRepo,
}