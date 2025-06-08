"use client"

import { Campaign } from "@/types/campaign"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progressPercentage = (campaign.raised / campaign.goal) * 100
  const isUrgent = campaign.urgency === 'Alta'
  const isCompleted = campaign.status === 'completed'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Alta': return 'bg-red-100 text-red-800'
      case 'Media': return 'bg-yellow-100 text-yellow-800'
      case 'Baja': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Médico': return 'bg-blue-100 text-blue-800'
      case 'Refugio': return 'bg-purple-100 text-purple-800'
      case 'Alimentación': return 'bg-orange-100 text-orange-800'
      case 'Rescate': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={getUrgencyColor(campaign.urgency)}>
              {campaign.urgency}
            </Badge>
            <Badge className={getCategoryColor(campaign.category)}>
              {campaign.category}
            </Badge>
          </div>
          {isCompleted && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white">
                Completada
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={campaign.organizer.avatar} />
            <AvatarFallback>{campaign.organizer.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{campaign.organizer.name}</span>
          {campaign.organizer.verified && (
            <Badge variant="outline" className="text-xs">
              Verificado
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {campaign.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{campaign.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{campaign.daysLeft} días</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{formatCurrency(campaign.raised)}</span>
            <span className="text-gray-500">de {formatCurrency(campaign.goal)}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round(progressPercentage)}% completado</span>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{campaign.donors} donantes</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/campanas/${campaign.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Ver Detalles
          </Button>
        </Link>
        <Link href={`/campanas/${campaign.id}/donar`} className="flex-1">
          <Button 
            className={`w-full bg-green-600 hover:bg-green-700`}
            disabled={isCompleted}
          >
            <Heart className="h-4 w-4 mr-2" />
            {isCompleted ? 'Completada' : 'Donar'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 