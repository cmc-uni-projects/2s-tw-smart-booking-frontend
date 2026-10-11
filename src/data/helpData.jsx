// src/data/helpData.jsx
// Help center structure. Texts live in i18n/locales/<lang>/help.json; use the hooks below.
import { useTranslation } from 'react-i18next';
import { BookOpen, CreditCard, User, Home } from 'lucide-react';

const CATEGORY_ICONS = { booking: BookOpen, payment: CreditCard, account: User, partner: Home };

const FAQ_CATEGORIES = {
    1: 'booking',
    2: 'booking',
    3: 'booking',
    4: 'booking',
    5: 'payment',
    6: 'payment',
    7: 'payment',
    8: 'account',
    9: 'account',
    10: 'account',
    11: 'partner',
    12: 'partner',
    13: 'partner',
};

export const useHelpCategories = () => {
    const { t } = useTranslation("help");
    return Object.entries(CATEGORY_ICONS).map(([id, icon]) => ({
        id,
        icon,
        name: t(`categories.${id}.name`),
        desc: t(`categories.${id}.desc`),
    }));
};

export const useFaqs = () => {
    const { t } = useTranslation("help");
    return Object.entries(FAQ_CATEGORIES).map(([id, category]) => ({
        id: Number(id),
        category,
        question: t(`faqs.${id}.question`),
        answer: t(`faqs.${id}.answer`),
    }));
};
