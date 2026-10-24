export const generateOTP = ()=>{
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const getOtpHtml = (otp) =>{
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OTP Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;padding:40px;box-shadow:0 0 10px rgba(0,0,0,0.1);">

<tr>
<td align="center">

<p style="color:#666;font-size:16px;line-height:24px;">
Hello,
</p>

<p style="color:#666;font-size:16px;line-height:24px;">
Use the following One-Time Password (OTP) to verify your email address.This OTP is valid for 5 minutes.
</p>

<div style="margin:30px 0;">
<span style="
display:inline-block;
padding:15px 35px;
font-size:32px;
font-weight:bold;
letter-spacing:8px;
background:#2563eb;
color:#fff;
border-radius:8px;">
${otp}
</span>
</div>

<p style="color:#888;font-size:14px;">
Do not share this OTP with anyone.
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

<p style="font-size:13px;color:#999;">
If you didn't request this OTP, please ignore this email.
</p>

</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
}