Get-ChildItem -Path . -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.html | Where-Object { $_.FullName -notlike '*node_modules*' } | ForEach-Object {
    $content = Get-Content $_.FullName
    $filtered = $content | Where-Object { 
        $_ -notmatch '^\s*//' -and 
        $_ -notmatch '^\s*/\*' -and 
        $_ -notmatch '^\s*<!--' -and 
        $_ -notmatch '^\s*\{\/\*' 
    }
    $filtered | Set-Content $_.FullName
}