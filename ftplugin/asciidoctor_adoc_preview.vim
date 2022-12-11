command! -buffer PreviewAsciiDoc call denops#plugin#wait_async('adoc_preview', {->denops#notify('adoc_preview', 'core', ["open"])})
