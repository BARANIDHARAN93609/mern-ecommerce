import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, changePassword } from "../../api/services";
import toast from "react-hot-toast";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmNew: "" });
  const [saving, setSaving]   = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmNew) { toast.error("Passwords do not match"); return; }
    if (pwdForm.newPassword.length < 6) { toast.error("Min 6 characters"); return; }
    setPwdSaving(true);
    try {
      await changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success("Password changed!");
      setPwdForm({ currentPassword: "", newPassword: "", confirmNew: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setPwdSaving(false); }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>
        <div className="profile-grid">
          <div className="card section-card">
            <h2>Personal Information</h2>
            <form onSubmit={handleProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" maxLength={10} value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
            </form>
          </div>

          <div className="card section-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" value={pwdForm.currentPassword} onChange={(e) => setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={pwdForm.newPassword} onChange={(e) => setPwdForm((p) => ({ ...p, newPassword: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" value={pwdForm.confirmNew} onChange={(e) => setPwdForm((p) => ({ ...p, confirmNew: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={pwdSaving}>{pwdSaving ? "Updating…" : "Update Password"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
