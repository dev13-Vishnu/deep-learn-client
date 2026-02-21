import { useState } from 'react';
import { profileApi, type ProfileData } from '../../../api/profile.api';
import { useNotify } from '../../../notifications/useNotify';
import { FieldError } from '../../../components/FieldError';
import { validateName } from '../../../utils/validation';

interface Props {
  profile: ProfileData;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({ profile, onSave, onCancel }: Props) {
  const notify = useNotify();

  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName:  profile.lastName  || '',
    bio:       profile.bio       || '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{
    firstName: string | null;
    lastName:  string | null;
  }>({ firstName: null, lastName: null });

  function validateAll(): boolean {
    const next = {
      firstName: validateName(formData.firstName, 'First name'),
      lastName:  validateName(formData.lastName,  'Last name'),
    };
    setErrors(next);
    return !next.firstName && !next.lastName;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setSaving(true);
    try {
      await profileApi.updateProfile(formData);
      notify('Profile updated successfully.', 'success');
      onSave();
    } catch (err: any) {
      notify(
        err?.response?.data?.message || 'Failed to update profile. Please try again.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

      <div className="space-y-4">
        {/* Email — read-only */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full bg-gray-50 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        {/* First Name — was previously concatenating firstName + lastName (bug) */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              if (errors.firstName)
                setErrors({ ...errors, firstName: validateName(e.target.value, 'First name') });
            }}
            onBlur={() =>
              setErrors({ ...errors, firstName: validateName(formData.firstName, 'First name') })
            }
            placeholder="Enter your first name"
            className={`w-full ${errors.firstName ? 'border-[color:var(--color-danger)]' : ''}`}
            disabled={saving}
          />
          <FieldError message={errors.firstName} />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              if (errors.lastName)
                setErrors({ ...errors, lastName: validateName(e.target.value, 'Last name') });
            }}
            onBlur={() =>
              setErrors({ ...errors, lastName: validateName(formData.lastName, 'Last name') })
            }
            placeholder="Enter your last name"
            className={`w-full ${errors.lastName ? 'border-[color:var(--color-danger)]' : ''}`}
            disabled={saving}
          />
          <FieldError message={errors.lastName} />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={4}
            maxLength={500}
            className="w-full"
            disabled={saving}
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {formData.bio.length}/500
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[color:var(--color-primary)] px-6 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-md border px-6 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}