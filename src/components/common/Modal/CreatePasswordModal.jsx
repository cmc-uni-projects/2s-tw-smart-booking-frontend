import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Mail, Check, Circle } from 'lucide-react'; // ✅ Import Check, Circle
import Button from '@/components/common/Button/Button';
import PasswordField from '@/components/common/Input/PasswordField';
import ModalPortal from './ModalPortal';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { useTranslation } from "react-i18next";

const CreatePasswordModal = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { currentUser, updateUser } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ STATE KIỂM TRA ĐỘ MẠNH
  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  if (!open) return null;

  // ✅ HÀM CHECK REAL-TIME
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);

    setValidations({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val),
    });
  };

  const isPasswordValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ KIỂM TRA TRƯỚC KHI GỬI
    if (!isPasswordValid) {
      setError(t("createPassword.weak"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      await authService.createPassword(password);
      updateUser({ hasPassword: true });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || t("createPassword.error"));
    } finally {
      setLoading(false);
    }
  };

  // Component hiển thị từng dòng điều kiện
  const ValidationItem = ({ fulfilled, text }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors ${fulfilled ? "text-green-600" : "text-gray-400"}`}>
      {fulfilled ? <Check size={14} strokeWidth={3} /> : <Circle size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <ModalPortal>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl w-[90%] max-w-md shadow-xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-gray-800">{t("createPassword.title")}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                <Mail className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                <div className="overflow-hidden">
                  <p className="text-sm text-blue-800 font-medium">{t("createPassword.loginEmail")}</p>
                  <p className="text-sm text-gray-600 truncate" title={currentUser?.email}>
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                    <PasswordField 
                    label={t("createPassword.newPassword")}
                    value={password}
                    onChange={handlePasswordChange} // ✅ Gọi hàm check mới
                    placeholder={t("createPassword.placeholder")}
                    />
                    
                    {/* ✅ HIỂN THỊ CHECKLIST */}
                    <div className="mt-3 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <ValidationItem fulfilled={validations.length} text={t("createPassword.rules.length")} />
                        <ValidationItem fulfilled={validations.upper} text={t("createPassword.rules.upper")} />
                        <ValidationItem fulfilled={validations.lower} text={t("createPassword.rules.lower")} />
                        <ValidationItem fulfilled={validations.number} text={t("createPassword.rules.number")} />
                        <ValidationItem fulfilled={validations.special} text={t("createPassword.rules.special")} />
                    </div>
                </div>
                
                <PasswordField 
                  label={t("confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("createPassword.confirmPlaceholder")}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("actions.cancelLong")}
                </Button>
                <Button 
                    type="submit" 
                    isLoading={loading} 
                    leftIcon={<Lock size={16}/>}
                    disabled={!isPasswordValid || !confirmPassword} // ✅ Disable nếu chưa đủ mạnh
                >
                  {t("createPassword.title")}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export default CreatePasswordModal;