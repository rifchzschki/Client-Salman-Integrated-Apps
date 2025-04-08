'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NewsItem {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  image?: string;
}

const dummyNews: NewsItem[] = [
  {
    id: 1,
    title: 'Keindahan Alam Indonesia',
    author: 'Andi Wijaya',
    date: '2025-04-05',
    content: 'Indonesia memiliki kekayaan alam yang luar biasa...',
    image: 'masjid-salman-itb.jpg'
  },
  {
    id: 2,
    title: 'Festival Budaya Nusantara',
    author: 'Siti Nurhaliza',
    date: '2025-04-03',
    content: 'Festival tahunan yang merayakan keberagaman budaya...',
    image: 'masjid-salman-itb.jpg'
  }
];

export default function EditBeritaPage() {
  const [news, setNews] = useState<NewsItem[]>(dummyNews);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);

  const handleDelete = () => {
    if (newsToDelete) {
      setNews((prev) => prev.filter((item) => item.id !== newsToDelete.id));
      setDeleteDialogOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleSave = () => {
    if (selectedNews) {
      setNews((prev) =>
        prev.map((item) => (item.id === selectedNews.id ? selectedNews : item))
      );
      setSelectedNews(null);
      setDialogOpen(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manajemen Berita</h1>
      <Button className="mb-4">Tambah Berita</Button>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 font-semibold bg-gray-100 p-3">
          <div className="col-span-1">Gambar</div>
          <div className="col-span-1">Judul</div>
          <div className="col-span-1">Penulis</div>
          <div className="col-span-1">Tanggal</div>
          <div className="col-span-2">Konten</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>

        {news.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-7 border-t items-center p-3 text-sm hover:bg-gray-50"
          >
            <div className="col-span-1">
              <img
                src={item.image || 'https://via.placeholder.com/100'}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <div className="col-span-1 font-medium">{item.title}</div>
            <div className="col-span-1">{item.author}</div>
            <div className="col-span-1">{item.date}</div>
            <div className="col-span-2 truncate">{item.content}</div>
            <div className="col-span-1 flex justify-center gap-2">
              {/* Edit Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedNews(item);
                      setDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Berita</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Judul"
                      value={selectedNews?.title || ''}
                      onChange={(e) =>
                        setSelectedNews((prev) =>
                          prev ? { ...prev, title: e.target.value } : prev
                        )
                      }
                    />
                    <Textarea
                      placeholder="Konten"
                      value={selectedNews?.content || ''}
                      onChange={(e) =>
                        setSelectedNews((prev) =>
                          prev ? { ...prev, content: e.target.value } : prev
                        )
                      }
                    />
                    <Input
                      placeholder="URL Gambar"
                      value={selectedNews?.image || ''}
                      onChange={(e) =>
                        setSelectedNews((prev) =>
                          prev ? { ...prev, image: e.target.value } : prev
                        )
                      }
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSave}>Simpan</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Dialog */}
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setNewsToDelete(item);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Hapus
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Yakin ingin menghapus berita{' '}
                      <span className="font-semibold">{newsToDelete?.title}</span>?
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Ya, Hapus
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
