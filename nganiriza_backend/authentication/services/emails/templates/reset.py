reset_password_template = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Password Reset OTP</title>
</head>
<body style="font-family: Arial, sans-serif;">

<table cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
    <td style="padding: 20px;">
        <p>Dear {user},</p>
        <p>You have requested to reset your password for your Nganiriza account.</p>
        <p>Your One-Time Password (OTP) for password reset is: <strong>{code}</strong></p>
        <p>If you did not request this password reset, please ignore this email or contact our support team immediately.</p>
        <p>Thank you.</p>
        <p>Best regards,<br/> Nganiriza Team</p>
    </td>
</tr>
</table>

</body>
</html>
"""