require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'avatar-view'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description'] + ' (local native module)'
  s.license        = { :type => 'MIT' }
  s.authors        = { 'Kevin Parra' => 'kevinparra@example.com' }
  s.homepage       = 'https://github.com/local/avatar-view'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.4'
  s.source         = { :dummy => true }

  s.dependency 'ExpoModulesCore'

  # source_files is relative to this podspec (which lives in the ios/ folder)
  s.source_files   = '**/*.{h,m,mm,swift}'
end
