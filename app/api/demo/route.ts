import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const { name, email, firm, phone, message } = data;

    if (!name || !email || !firm) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save to database
    // Example with PostgreSQL:
    // await db.leads.create({
    //   data: { name, email, firm, phone, message, createdAt: new Date() }
    // });

    // TODO: Send notification email
    // Example:
    // await sendEmail({
    //   to: 'info@winwinlaw.com',
    //   subject: `New Demo Request from ${name}`,
    //   body: `
    //     Name: ${name}
    //     Email: ${email}
    //     Firm: ${firm}
    //     Phone: ${phone || 'Not provided'}
    //     Message: ${message || 'None'}
    //   `
    // });

    console.log('Demo request received:', { name, email, firm, phone, message });

    return NextResponse.json({
      success: true,
      message: 'Thank you! We will contact you shortly.'
    });

  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
