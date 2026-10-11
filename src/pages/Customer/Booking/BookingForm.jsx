import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import './BookingForm.css';
import { Contact, Users, CheckSquare, FileText, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Component nhập số điện thoại (Nội bộ)
const PhoneInput = ({ value, onChange }) => (
    <div className="phone-input-wrapper">
        <select className="country-code" defaultValue="+84">
            <option value="+84">🇻🇳 +84</option>
            <option value="+1">🇺🇸 +1</option>
        </select>
        <input
            type="tel"
            className="form-input"
            placeholder=""
            value={value}
            onChange={onChange}
            name="phone"
            required
        />
    </div>
);

const BookingForm = ({ onChange, initialData, initialContact }) => {
    const { user } = useAuth();
    const { t } = useTranslation("booking");

    // State Contact
    const [contact, setContact] = useState(initialData?.contact || initialContact || {
        fullName: '',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState({
        fullName: '',
        phone: '',
        email: '',
    });

    // State GuestName
    const [guestName, setGuestName] = useState(initialData?.guestName || '');

    // Checkbox "Đặt cho mình"
    const [isBookingForSelf, setIsBookingForSelf] = useState(() => {
        if (initialData?.contact?.fullName && initialData?.guestName) {
            return initialData.contact.fullName === initialData.guestName;
        }
        return false;
    });

    // State SpecialRequests
    const [specialRequests, setSpecialRequests] = useState(initialData?.specialRequests || {
        nonSmoking: false,
        connectingRoom: false,
        highFloor: false,
    });

    // Cập nhật dữ liệu lên cha mỗi khi form thay đổi
    useEffect(() => {
        if (onChange) {
            onChange({
                contact,
                guestName,
                specialRequests,
            });
        }
    }, [contact, guestName, specialRequests, onChange]);

    // Auto-fill tên khách khi chọn "Đặt cho mình"
    useEffect(() => {
        if (isBookingForSelf) {
            setGuestName(contact.fullName);
        }
    }, [isBookingForSelf, contact.fullName]);

    // --- VALIDATION ---
    const validateFullName = (name) => {
        if (!name.trim()) return t("validation.nameRequired");
        const regex = /^[A-Za-zÀ-ỹ\s]+$/; // i18n-ignore (character range)
        if (!regex.test(name)) return t("validation.nameLetters");
        return '';
    };

    const validatePhone = (phone) => {
        const regex = /^0[0-9]{9}$/;
        if (!regex.test(phone)) return t("validation.phoneFormat");
        return '';
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return t("validation.emailInvalid");
        return '';
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContact({ ...contact, [name]: value });

        if (name === 'fullName') setErrors({ ...errors, fullName: validateFullName(value) });
        if (name === 'phone') setErrors({ ...errors, phone: validatePhone(value) });
        if (name === 'email') setErrors({ ...errors, email: validateEmail(value) });
    };

    const handleRequestChange = (e) => {
        setSpecialRequests({
            ...specialRequests,
            [e.target.name]: e.target.checked,
        });
    };

    return (
        <div className="booking-form-container">
            {/* PHẦN 1: LIÊN HỆ */}
            <div className="form-section">
                <div className="form-header">
                    <Contact size={20} className="form-header-icon" />
                    <h2>{t("form.contactTitle")}</h2>
                </div>
                <p className="form-description">{t("form.contactText")}</p>

                <div className="form-group">
                    <label htmlFor="fullName">{t("form.fullName")} <span>*</span></label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="form-input"
                        value={contact.fullName}
                        onChange={handleContactChange}
                        required
                    />
                    {errors.fullName && <small style={{ color: "red" }}>{errors.fullName}</small>}
                    <small>{t("form.nameHint")}</small>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone">{t("form.phone")} <span>*</span></label>
                        <PhoneInput
                            value={contact.phone}
                            onChange={handleContactChange}
                        />
                        {errors.phone && <small style={{ color: "red" }}>{errors.phone}</small>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email <span>*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={contact.email}
                            onChange={handleContactChange}
                            required
                        />
                        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}
                    </div>
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="forSelf"
                        checked={isBookingForSelf}
                        onChange={(e) => setIsBookingForSelf(e.target.checked)}
                    />
                    <label htmlFor="forSelf">{t("form.forSelf")}</label>
                </div>
            </div>

            {/* PHẦN 2: KHÁCH HÀNG */}
            <div className="form-section">
                <div className="form-header">
                    <Users size={20} className="form-header-icon" />
                    <h2>{t("form.guestTitle")}</h2>
                </div>

                <div className="form-group">
                    <label htmlFor="guestName">{t("form.fullName")} <span>*</span></label>
                    <input
                        type="text"
                        id="guestName"
                        name="guestName"
                        className="form-input"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        readOnly={isBookingForSelf}
                        required
                    />
                </div>
            </div>

            {/* PHẦN 3: YÊU CẦU ĐẶC BIỆT */}
            <div className="form-section">
                <div className="form-header">
                    <CheckSquare size={20} className="form-header-icon" />
                    <h2>{t("form.specialTitle")}</h2>
                </div>
                <div className="special-requests-grid">
                    <div className="checkbox-group-vertical">
                        <input type="checkbox" id="nonSmoking" name="nonSmoking" checked={specialRequests.nonSmoking} onChange={handleRequestChange} />
                        <label htmlFor="nonSmoking">{t("form.nonSmoking")}</label>
                    </div>
                    <div className="checkbox-group-vertical">
                        <input type="checkbox" id="connectingRoom" name="connectingRoom" checked={specialRequests.connectingRoom} onChange={handleRequestChange} />
                        <label htmlFor="connectingRoom">{t("form.connecting")}</label>
                    </div>
                    <div className="checkbox-group-vertical">
                        <input type="checkbox" id="highFloor" name="highFloor" checked={specialRequests.highFloor} onChange={handleRequestChange} />
                        <label htmlFor="highFloor">{t("form.highFloor")}</label>
                    </div>
                </div>
            </div>

            {/* PHẦN 4: CHÍNH SÁCH */}
            <div className="form-section">
                <div className="form-header">
                    <FileText size={20} className="form-header-icon" />
                    <h2>{t("form.policyTitle")}</h2>
                </div>
                <div className="policy-item">
                    <Ban size={18} className="policy-icon no-smoking" />
                    <div className="policy-content">
                        <strong>{t("form.smoking")}</strong>
                        <p>{t("form.noSmoking")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;