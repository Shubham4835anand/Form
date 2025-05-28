import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from '@mui/material';

const professions = ['Student', 'Developer', 'Entrepreneur'];
const subscriptionPlans = ['Basic', 'Pro', 'Enterprise'];

export default function MultiStepProfileForm() {
  const [step, setStep] = useState(0);
  const steps = ['Profile Info', 'Address & Profession', 'Subscription'];

  const [formData, setFormData] = useState({
    photo: null,
    username: '',
    currentPassword: '',
    newPassword: '',
    profession: '',
    companyName: '',
    addressLine1: '',
    country: '',
    state: '',
    city: '',
    subscriptionPlan: 'Basic',
    newsletter: true,
  });

  // Just dummy data for countries/states/cities for example
  const countries = [
    { id: 'US', name: 'United States' },
    { id: 'CA', name: 'Canada' },
  ];
  const states = [
    { id: 'CA', name: 'California' },
    { id: 'NY', name: 'New York' },
  ];
  const cities = [
    { id: 'LA', name: 'Los Angeles' },
    { id: 'SF', name: 'San Francisco' },
  ];

  const handleChange = (field, value) =>
    setFormData({ ...formData, [field]: value });

  const handleNext = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formPayload.append(key, value)
      );

      const res = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        body: formPayload,
      });

      const data = await res.json();
      if (data.success) {
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile: ' + data.message);
      }
    } catch (error) {
      alert('Error submitting form');
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant='outlined' component='label'>
            Upload Profile Photo
            <input
              hidden
              accept='image/*'
              type='file'
              onChange={(e) => handleChange('photo', e.target.files[0])}
            />
          </Button>

          <TextField
            label='Username'
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            helperText='4-20 characters, no spaces'
            fullWidth
          />

          <TextField
            label='Current Password'
            type='password'
            value={formData.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            fullWidth
          />

          <TextField
            label='New Password'
            type='password'
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            helperText='8+ chars, 1 special char, 1 number'
            fullWidth
          />
        </Box>
      )}

      {step === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Profession</InputLabel>
            <Select
              value={formData.profession}
              label='Profession'
              onChange={(e) => handleChange('profession', e.target.value)}
            >
              {professions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.profession === 'Entrepreneur' && (
            <TextField
              label='Company Name'
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              fullWidth
            />
          )}

          <TextField
            label='Address Line 1'
            value={formData.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              value={formData.country}
              label='Country'
              onChange={(e) => handleChange('country', e.target.value)}
            >
              {countries.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              value={formData.state}
              label='State'
              onChange={(e) => handleChange('state', e.target.value)}
            >
              {states.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select
              value={formData.city}
              label='City'
              onChange={(e) => handleChange('city', e.target.value)}
            >
              {cities.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {step === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl component='fieldset'>
            <Typography variant='subtitle1' gutterBottom>
              Subscription Plan
            </Typography>
            <RadioGroup
              value={formData.subscriptionPlan}
              onChange={(e) => handleChange('subscriptionPlan', e.target.value)}
            >
              {subscriptionPlans.map((plan) => (
                <FormControlLabel
                  key={plan}
                  value={plan}
                  control={<Radio />}
                  label={plan}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.newsletter}
                onChange={(e) => handleChange('newsletter', e.target.checked)}
              />
            }
            label='Subscribe to Newsletter'
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button disabled={step === 0} variant='outlined' onClick={handlePrev}>
          Previous
        </Button>

        {step < steps.length - 1 ? (
          <Button variant='contained' onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
}
