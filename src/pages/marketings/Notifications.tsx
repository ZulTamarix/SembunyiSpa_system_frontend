import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Grid from "../../components/ui/Grid";

const Notifications: React.FC = () => {
    
    // 2) card style
    const iconStyle = "text-2xl";
    const titleStyle = "font-semibold";
    const dataStyle = "text-sm text-title";
    const infoStyle = "font-semibold text-secondary";

    return (
        <>
            <Grid className="md:grid-cols-5 items-center">
                <span className="text-title md:col-span-2">Manage notification templates</span>
                <Button icon={Plus} label='Create Notification' className="md:col-start-5"/>
            </Grid>

            {/* Info */}
            <Grid className="md:grid-cols-3">
                <Card>
                    <div className="flex flex-col gap-2">
                        <span className={iconStyle}>📅</span>
                        <span className={titleStyle}>Booking Notifications</span>
                        <span className={dataStyle}>Booking confirmation, updates, and cancellations</span>
                        <span className={infoStyle}>8 templates</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-2">
                        <span className={iconStyle}>⏰</span>
                        <span className={titleStyle}>Reminder Notifications</span>
                        <span className={dataStyle}>Appointment reminders and follow-ups</span>
                        <span className={infoStyle}>5 templates</span>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-2">
                        <span className={iconStyle}>🎁</span>
                        <span className={titleStyle}>Promotional Notifications</span>
                        <span className={dataStyle}>Marketing campaigns and special offers</span>
                        <span className={infoStyle}>3 templates</span>
                    </div>
                </Card>
            </Grid>
        </>
    )
}

export default Notifications;