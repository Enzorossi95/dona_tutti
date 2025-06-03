"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Shield,
  Camera,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  CreditCard,
  Smartphone,
  Globe,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "Transparencia Total",
      description: "Cada peso donado es rastreado con comprobantes reales y actualizaciones constantes.",
    },
    {
      icon: Camera,
      title: "Actualizaciones en Tiempo Real",
      description: "Sube fotos y videos del progreso para que los donantes vean el impacto directo.",
    },
    {
      icon: FileText,
      title: "Comprobantes Verificados",
      description: "Todos los gastos están respaldados con facturas y documentos oficiales.",
    },
    {
      icon: CreditCard,
      title: "Donaciones Seguras",
      description: "Integración con MercadoPago para donaciones rápidas y seguras.",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Crea tu Campaña",
      description: "Cuenta la historia, sube fotos y establece tu objetivo de recaudación.",
      icon: Heart,
    },
    {
      number: "02",
      title: "Comparte y Recauda",
      description: "Difunde tu campaña en redes sociales y recibe donaciones seguras.",
      icon: Users,
    },
    {
      number: "03",
      title: "Mantén Informados",
      description: "Sube actualizaciones con fotos y comprobantes de cada gasto realizado.",
      icon: Camera,
    },
    {
      number: "04",
      title: "Genera Confianza",
      description: "La transparencia total genera más donaciones y mayor impacto.",
      icon: TrendingUp,
    },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Fundación Patitas Felices",
      content:
        "Gracias a DonaAyuda pudimos recaudar $150,000 para la cirugía de Luna. La transparencia nos ayudó a generar confianza.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Rescatista Independiente",
      content: "La plataforma es súper fácil de usar. En 2 días ya tenía mi campaña activa y recibiendo donaciones.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      role: "Donante Frecuente",
      content: "Me encanta poder ver exactamente en qué se usa mi dinero. Los comprobantes me dan total tranquilidad.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
    },
  ]

  const stats = [
    { number: "500+", label: "Animales Ayudados" },
    { number: "$2.5M", label: "Recaudado" },
    { number: "1,200+", label: "Donantes Activos" },
    { number: "98%", label: "Transparencia" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-800 px-4 py-2">
                  🚀 Plataforma de Donaciones Transparentes
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Ayuda que se ve,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                    {" "}
                    impacto real
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Crea campañas de donación 100% transparentes. Cada peso donado es rastreado con comprobantes reales y
                  actualizaciones constantes para generar confianza total.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/campanas">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                    <Heart className="h-5 w-5 mr-2" />
                    Ver Campañas
                  </Button>
                </Link>
                <Link href="/admin/campanas/crear">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                    Crear Campaña Gratis
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Gratis para siempre
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Sin comisiones ocultas
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  100% transparente
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/image_home_1.png"
                  alt="Plataforma DonaAyuda"
                  width={500}
                  height={600}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir DonaAyuda?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La primera plataforma que pone la transparencia en el centro de las donaciones, generando confianza real
              entre donantes y organizaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cómo Funciona</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En 4 simples pasos puedes crear una campaña transparente que genere confianza y maximice las donaciones
              para tu causa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-blue-200 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Donaciones Súper Fáciles</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Integración completa con MercadoPago para que donar sea tan fácil como hacer una compra online.
                Tarjetas, transferencias, efectivo - todos los métodos disponibles.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Tarjetas de crédito y débito</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Transferencias bancarias</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Pagos en efectivo (Rapipago, Pago Fácil)</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">MP</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Powered by MercadoPago</h4>
                    <p className="text-sm text-gray-600">Pagos seguros y confiables</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-green-100 text-green-800">Verificado</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/image_home_2.png"
                alt="Donaciones fáciles"
                width={400}
                height={500}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-xl text-gray-600">Miles de organizaciones ya confían en DonaAyuda para sus campañas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">¿Listo para crear tu campaña?</h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Únete a cientos de organizaciones que ya están generando impacto real con transparencia total. Es gratis y
            toma menos de 5 minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin/campanas/crear">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                <Heart className="h-5 w-5 mr-2" />
                Crear Campaña Gratis
              </Button>
            </Link>
            <Link href="/campanas">
              <Button size="lg" className="bg-green-600 text-white px-8 py-4 text-lg font-semibold hover:bg-green-700">
                Ver Campañas Activas
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-green-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Sin costo de setup
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Soporte 24/7
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Resultados garantizados
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
