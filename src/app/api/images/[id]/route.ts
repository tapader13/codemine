import { type NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    console.log('Deleting image with ID:', id);
    const result = await cloudinary.uploader.destroy(`gallery/${id}`);
    console.log('Deleting image:', id, result);
    if (result.result !== 'ok') {
      throw new Error('Failed to delete image');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
