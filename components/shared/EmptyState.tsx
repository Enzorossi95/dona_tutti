import Link from "next/link";
import { Button } from "../ui/button";

export default function EmptyState({title, description}: {title: string, description: string}) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-600 mb-6">{description}</p>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </div>
      )
}