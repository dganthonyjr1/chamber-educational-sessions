import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Percent, Calendar, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Partnership() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {language === 'es' ? 'Modelo de Asociación' : 'Partnership Model'}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {language === 'es'
                ? 'Una asociación mutuamente beneficiosa que genera ingresos para su Cámara mientras ofrece educación en IA de clase mundial a sus miembros.'
                : 'A mutually beneficial partnership that generates revenue for your Chamber while delivering world-class AI education to your members.'}
            </p>
          </div>

          {/* Community Revenue Share */}
          <section className="mb-16">
            <Card className="border-2 border-primary/30 shadow-lg">
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Percent className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    {language === 'es' ? 'Participación en Ingresos de la Comunidad' : 'Community Revenue Share'}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20">
                    <p className="text-2xl font-bold text-primary mb-2">
                      {language === 'es' ? '15% de Participación en Ingresos' : '15% Revenue Share'}
                    </p>
                    <p className="text-muted-foreground">
                      {language === 'es'
                        ? 'SIA proporciona a su Cámara una participación del quince por ciento (15%) en los ingresos netos recurrentes de suscripción generados por los miembros de su Cámara que se inscriban en los servicios de SIA a través de esta asociación.'
                        : 'SIA provides your Chamber with a fifteen percent (15%) community revenue share on net recurring subscription revenue generated from your Chamber members who enroll in SIA services through this partnership.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      {language === 'es' ? 'Condiciones de Participación en Ingresos' : 'Revenue Share Conditions'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            {language === 'es' ? 'Pagos Mensuales' : 'Monthly Payments'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'es'
                              ? 'Los pagos se emiten mensualmente el día 15 de cada mes.'
                              : 'Payments are issued monthly on the 15th of each month.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            {language === 'es' ? 'Tarifas Recurrentes Solamente' : 'Recurring Fees Only'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'es'
                              ? 'Se aplica solo a las tarifas de suscripción recurrentes.'
                              : 'Applies only to recurring subscription fees.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            {language === 'es' ? 'Ingresos de Por Vida' : 'Lifetime Revenue'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'es'
                              ? 'Continúa durante la vida de cada cliente calificado, siempre que el cliente permanezca como miembro activo de su Cámara y suscriptor activo de SIA.'
                              : 'Continues for the lifetime of each qualifying client, provided the client remains an active Chamber member and an active SIA subscriber.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">
                            {language === 'es' ? 'Exclusiones' : 'Exclusions'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'es'
                              ? 'Las tarifas de configuración únicas, basadas en uso y de terceros están excluidas a menos que se acuerde lo contrario por escrito.'
                              : 'One-time setup, usage-based, and third-party pass-through fees are excluded unless otherwise agreed in writing.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Chamber Service Discount */}
          <section className="mb-16">
            <Card className="border-2 border-accent/30 shadow-lg">
              <CardContent className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    {language === 'es' ? 'Descuento de Servicio para la Cámara' : 'Chamber Service Discount'}
                  </h2>
                </div>

                <div className="bg-gradient-to-br from-accent/5 to-primary/5 p-6 rounded-lg border border-accent/20">
                  <p className="text-2xl font-bold text-accent mb-2">
                    {language === 'es' ? '50% de Descuento' : '50% Discount'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'es'
                      ? 'SIA proporcionará a su Cámara un descuento del cincuenta por ciento (50%) en todos los servicios comprados directamente por la Cámara durante la duración de este Acuerdo.'
                      : 'SIA will provide your Chamber with a fifty percent (50%) discount on all services purchased directly by the Chamber for the duration of this Agreement.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10">
              {language === 'es' ? 'Cómo Funciona' : 'How It Works'}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-border hover:border-primary/50 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === 'es' ? 'Plataforma Gratuita' : 'Free Platform'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Su Cámara obtiene acceso completo a nuestra plataforma educativa de IA sin costo alguno.'
                      : 'Your Chamber gets full access to our AI education platform at no cost.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-primary/50 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === 'es' ? 'Los Miembros Aprenden' : 'Members Learn'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Los miembros de su Cámara toman cursos de IA y ven resultados empresariales reales.'
                      : 'Your Chamber members take AI courses and see real business results.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-primary/50 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {language === 'es' ? 'Ambos Ganan' : 'Both Win'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es'
                      ? 'Cuando los miembros compran servicios premium de IA, su Cámara gana el 15% de ingresos recurrentes.'
                      : 'When members purchase premium AI services, your Chamber earns 15% recurring revenue.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-gradient-to-br from-primary/5 to-accent/5 p-10 rounded-2xl border-2 border-primary/20">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'es' ? '¿Listo para Comenzar?' : 'Ready to Get Started?'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {language === 'es'
                ? 'Únase a las Cámaras que ya están generando ingresos mientras ofrecen valor real a sus miembros.'
                : 'Join the Chambers already generating revenue while delivering real value to their members.'}
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-xl font-bold shadow-xl">
                {language === 'es' ? 'Contáctenos Hoy' : 'Contact Us Today'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
