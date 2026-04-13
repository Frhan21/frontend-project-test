import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentPage() {
  return (
    <Card className="border-border/60 bg-background">
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>Halaman payments sudah disiapkan agar route bisa diakses.</p>
        <p>
          Akses API belum diimplementasikan sesuai instruksi karena endpoint ini memiliki
          policy yang berbeda.
        </p>
      </CardContent>
    </Card>
  )
}
