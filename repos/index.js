import _MenuRepo from './MenuRepo';
import _DiscordAccountRepo from './DiscordAccountRepo';
import _OnAirCompanyRepo from './OnAirCompanyRepo';
import _MenuItemRepo from './MenuItemRepo';

export const MenuRepo = _MenuRepo;
export const MenuItemRepo = _MenuItemRepo;
export const DiscordAccountRepo = _DiscordAccountRepo;
export const OnAirCompanyRepo = _OnAirCompanyRepo;

export default {
    MenuRepo,
    MenuItemRepo,
    DiscordAccountRepo,
    OnAirCompanyRepo,
}