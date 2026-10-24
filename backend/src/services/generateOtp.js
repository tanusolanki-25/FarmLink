export const generateOTP = ()=>{
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const getOtpHtml = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FarmLink OTP Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f7f2;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f2;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:40px;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

<tr>
<td align="center">

<h1 style="margin:0;color:#16a34a;font-size:32px;">
🌾 FarmLink
</h1>

<p style="margin-top:8px;color:#6b7280;font-size:15px;">
Smart Procurement Management System
</p>

<hr style="margin:25px 0;border:none;border-top:1px solid #e5e7eb;">

<p style="font-size:16px;color:#374151;line-height:26px;">
Hello,
</p>

<p style="font-size:16px;color:#4b5563;line-height:26px;">
Thank you for registering with <strong>FarmLink</strong>.
Use the OTP below to verify your email address.
This OTP is valid for <strong>5 minutes</strong>.
</p>

<div style="margin:35px 0;">
<span style="
display:inline-block;
padding:16px 40px;
background:#16a34a;
color:#ffffff;
font-size:34px;
font-weight:bold;
letter-spacing:10px;
border-radius:10px;">
${otp}
</span>
</div>

<p style="font-size:15px;color:#6b7280;line-height:24px;">
Please do not share this OTP with anyone. FarmLink will never ask you for your OTP over phone, email, or message.
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;">

<p style="font-size:14px;color:#9ca3af;line-height:22px;">
If you did not request this verification, you can safely ignore this email.
</p>

<p style="margin-top:25px;font-size:14px;color:#6b7280;">
Regards,<br>
<strong style="color:#16a34a;">FarmLink Team</strong>
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};