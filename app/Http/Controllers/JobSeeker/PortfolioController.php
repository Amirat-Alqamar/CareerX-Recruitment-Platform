<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    public function index()
    {
        return redirect()->route('seeker.profile', ['modal' => 'portfolio']);
    }

    public function store(Request $request)
    {
        // إذا أدخل المستخدم الرابط بدون http/https نضيف https تلقائياً
        if ($request->filled('url')) {
            $url = trim($request->url);
            if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                $url = "https://" . $url;
            }
            $request->merge(['url' => $url]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type'  => 'nullable|string|max:100',
            'url'   => 'nullable|url|max:255',
            'file'  => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', 'يجب إنشاء بيانات البروفايل الأساسية أولاً.');
        }

        if ($request->hasFile('file')) {
            $validated['file_path'] = $request->file('file')->store('portfolio', 'public');
        }

        $profile->portfolioItems()->create($validated);

        return redirect()->back()->with('success', 'تمت إضافة العمل إلى المعرض بنجاح.');
    }

    private function checkAuthorization(PortfolioItem $portfolio)
    {
        if ($portfolio->profile_id !== Auth::user()->profile?->id) {
            abort(403, 'غير مصرح لك بالوصول إلى هذا العنصر.');
        }
    }

    public function update(Request $request, PortfolioItem $portfolio)
    {
        $this->checkAuthorization($portfolio);

        // تنسيق الرابط تلقائياً
        if ($request->filled('url')) {
            $url = trim($request->url);
            if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                $url = "https://" . $url;
            }
            $request->merge(['url' => $url]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type'  => 'nullable|string|max:100',
            'url'   => 'nullable|url|max:255',
            'file'  => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        if ($request->hasFile('file')) {
            // حذف الملف القديم إن وجد
            if ($portfolio->file_path && Storage::disk('public')->exists($portfolio->file_path)) {
                Storage::disk('public')->delete($portfolio->file_path);
            }
            $validated['file_path'] = $request->file('file')->store('portfolio', 'public');
        }

        $portfolio->update($validated);

        return redirect()->back()->with('success', 'تم تحديث العمل بنجاح.');
    }

    public function destroy(PortfolioItem $portfolio)
    {
        $this->checkAuthorization($portfolio);

        if ($portfolio->file_path && Storage::disk('public')->exists($portfolio->file_path)) {
            Storage::disk('public')->delete($portfolio->file_path);
        }

        $portfolio->delete();

        return redirect()->back()->with('success', 'تم حذف العمل من المعرض بنجاح.');
    }
}
