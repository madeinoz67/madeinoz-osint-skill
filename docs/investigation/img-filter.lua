-- Lua filter for Pandoc: constrains appendix screenshots to fit page
function Image(el)
  if el.src:match("^screenshots/") then
    if FORMAT:match "latex" then
      local src = "docs/investigation/" .. el.src
      local caption = el.caption and pandoc.utils.stringify(el.caption) or ""
      return pandoc.RawInline("latex",
        string.format(
          "\\noindent\\includegraphics[width=\\textwidth,height=0.82\\textheight,keepaspectratio]{%s}\\par\\vspace{2mm}\\noindent\\textit{\\small %s}\\par\\vspace{6mm}",
          src, caption:gsub("([%%&])", "\\%1")
        )
      )
    end
  end
  return el
end
