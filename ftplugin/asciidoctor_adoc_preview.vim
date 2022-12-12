command! -buffer PreviewAsciiDoc call denops#plugin#wait_async('adoc_preview', {->denops#notify('adoc_preview', 'core', ["open"])})

function! s:cursor_moved() abort
    let l:current_line = getline('.')
    call denops#plugin#wait_async('adoc_preview', {->denops#notify('adoc_preview', 'cursorMoved', [l:current_line])})
endfunction

augroup adoc_preview
    autocmd! cursorMoved *.adoc call s:cursor_moved()
augroup END
