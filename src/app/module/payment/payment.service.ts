// import { Movie } from './../../../generated/prisma/models/Movie';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma/enums";
// import { sendEmail } from "../../utils/email";
// import { uploadFileToCloudinary } from "../../../config/cloudinary.config";
// import { generateInvoicePdf } from "./payment.utiles";



const handlerStripeWebhookEvent = async (event : Stripe.Event) =>{

    const existingPayment = await prisma.payment.findFirst({
        where:{
            stripeEventId : event.id
        }
    })

    if(existingPayment){
        console.log(`Event ${event.id} already processed. Skipping`);
        return {message : `Event ${event.id} already processed. Skipping`}
    }

    switch(event.type){
        case "checkout.session.completed": {
            const session = event.data.object as any;

            const bookingId = session.metadata?.bookingId;
            const paymentId = session.metadata?.paymentId;

            if (!bookingId || !paymentId) {
                console.error("⚠️ Missing metadata in webhook event");
                return { message: "Missing metadata" };
            }

            // Verify appointment exists with related data
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    review: true,
                    payment: true,
                    movie: true,
                    
                }
            });

            if (!booking) {
                console.error(`⚠️ Booking ${bookingId} not found. Payment may be for expired booking.`);
                return { message: "Booking not found" };
            }
            // let pdfBuffer: Buffer | null = null;

            // Update both booking and payment in a transaction
            const result = await prisma.$transaction(async (tx) => {
                const updatedbooking = await tx.booking.update({
                    where: {
                        id: bookingId
                    },
                    data: {
                        paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
                    }
                });

                // let invoiceUrl = null;
                

                // If payment is successful, generate and upload invoice
                // if (session.payment_status === "paid") {
                //     try {
                //         // Generate invoice PDF
                //         pdfBuffer = await generateInvoicePdf({
                //             invoiceId: appointment.payment?.id || paymentId,
                //             patientName: appointment.patient.name,
                //             patientEmail: appointment.patient.email,
                //             doctorName: appointment.doctor.name,
                //             appointmentDate: appointment.schedule.startDateTime.toString(),
                //             amount: appointment.payment?.amount || 0,
                //             transactionId: appointment.payment?.transactionId || "",
                //             paymentDate: new Date().toISOString()
                //         });

                //         // Upload PDF to Cloudinary
                //         const cloudinaryResponse = await uploadFileToCloudinary(
                //             pdfBuffer,
                //             `ph-healthcare/invoices/invoice-${paymentId}-${Date.now()}.pdf`
                //         );

                //         invoiceUrl = cloudinaryResponse?.secure_url;

                //         console.log(`✅ Invoice PDF generated and uploaded for payment ${paymentId}`);
                //     } catch (pdfError) {
                //         console.error("❌ Error generating/uploading invoice PDF:", pdfError);
                //         // Continue with payment update even if PDF generation fails
                //     }
                // }

                const updatedPayment = await tx.payment.update({
                    where: {
                        id: paymentId
                    },
                    data: {
                        status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                        paymentGatewayData: session,
                        // invoiceUrl: invoiceUrl, // Store invoice URL
                        stripeEventId: event.id // Store event ID for idempotency
                    }
                });

                return { updatedbooking, updatedPayment };
            });

            // Send invoice email to patient (outside transaction to avoid blocking payment update)
            // if (session.payment_status === "paid" && result.invoiceUrl) {
            //     try {
            //         await sendEmail({
            //             to: appointment.patient.email,
            //             subject: `Payment Confirmation & Invoice - Appointment with ${appointment.doctor.name}`,
            //             templateName: "invoice",
            //             templateData: {
            //                 patientName: appointment.patient.name,
            //                 invoiceId: appointment.payment?.id || paymentId,
            //                 transactionId: appointment.payment?.transactionId || "",
            //                 paymentDate: new Date().toLocaleDateString(),
            //                 doctorName: appointment.doctor.name,
            //                 appointmentDate: new Date(appointment.schedule.startDateTime).toLocaleDateString(),
            //                 amount: appointment.payment?.amount || 0,
            //                 invoiceUrl: result.invoiceUrl
            //             },
            //             attachments: [
            //                 {
            //                     filename: `Invoice-${paymentId}.pdf`,
            //                     content: pdfBuffer || Buffer.from(""), // Attach PDF if generated, else empty buffer
            //                     contentType: 'application/pdf'
            //                 }
            //             ]
            //         });

            //         console.log(`✅ Invoice email sent to ${appointment.patient.email}`);
            //     } catch (emailError) {
            //         console.error("❌ Error sending invoice email:", emailError);
            //         // Log but don't fail the payment if email fails
            //     }
            // }

            console.log(`✅ Payment ${session.payment_status} for appointment ${bookingId}`,result);
            break;
        }

        case "checkout.session.expired" : {
                const session = event.data.object

                console.log(`Checkout session ${session.id} expired. Marking associated payment as failed.`);
                break;

        }
        case "payment_intent.payment_failed" : {
            const session = event.data.object

            console.log(`Payment intent ${session.id} failed. Marking associated payment as failed.`);
            break;
        }
        default :
            console.log(`Unhandled event type ${event.type}`);
    }

    return {message : `Webhook Event ${event.id} processed successfully`}
}

const totalPayment = async () => {
  const payments = await prisma.payment.findMany({
    where: {
      status: "PAID",
    },
    include: {
      booking: {
        include: {
          movie: true,
        },
      },
    },
  });
const movieCount= payments.reduce((sum, p) => {
    return sum + (p.booking?.movie ? 1 : 0);
  }, 0);
  const total = payments.reduce((sum, p) => {
    return sum + (p.booking?.movie?.price || 0);
  }, 0);

  return {
    totalRevenue: total,
    totalMoviesBooked: movieCount,
  };
};

const updatePaymentStatus = async (bookingId: string) => {
  const bookingData = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  await prisma.$transaction(async (tx) => {
   
    await tx.payment.update({
      where: {
        bookingId: bookingData.id,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });

    
    await tx.booking.update({
      where: {
        id: bookingData.id,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: AppointmentStatus.COMPLETED,
      },
    });
  });

  return { message: "Payment updated successfully" };
};
export const PaymentService = {
    handlerStripeWebhookEvent,
    totalPayment,
    updatePaymentStatus
}
